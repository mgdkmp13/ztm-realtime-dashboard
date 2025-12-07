using System.Text.Json;
using ztmApp.Models;
using Microsoft.Extensions.Caching.Memory;

namespace ztmApp.Services
{
    public class StopService : IStopService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly ILogger<StopService> _logger;
        private const string STOPS_CACHE_KEY = "ztm_all_stops";
        private const string STOPS_URL = "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";
        private const string DEPARTURES_URL = "https://ckan2.multimediagdansk.pl/departures";

        public StopService(HttpClient httpClient, IMemoryCache cache, ILogger<StopService> logger)
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;
        }

        public async Task<List<object>> GetAllStopsFromZtm()
        {
            if (_cache.TryGetValue(STOPS_CACHE_KEY, out List<object>? cachedStops) && cachedStops != null)
            {
                _logger.LogInformation("Returning cached stops.json");
                return cachedStops;
            }

            try
            {
                _logger.LogInformation("Fetching stops.json from ZTM API");
                var response = await _httpClient.GetStringAsync(STOPS_URL);
                var stops = JsonSerializer.Deserialize<List<object>>(response) ?? new List<object>();

                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));

                _cache.Set(STOPS_CACHE_KEY, stops, cacheOptions);
                _logger.LogInformation("Cached {Count} stops for 24 hours", stops.Count);

                return stops;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching stops from ZTM API");
                return new List<object>();
            }
        }

        public async Task<List<object>> AttachLiveData(List<Stop> stops)
        {
            var result = new List<object>();

            foreach (var stop in stops)
            {
                try
                {
                    var departuresUrl = $"{DEPARTURES_URL}?stopId={stop.StopId.Value}";
                    _logger.LogInformation("Fetching live data from: {Url}", departuresUrl);
                    
                    var response = await _httpClient.GetStringAsync(departuresUrl);
                    var liveData = JsonSerializer.Deserialize<object>(response);

                    result.Add(new
                    {
                        id = stop.Id,
                        stopId = stop.StopId.Value,
                        stopDesc = stop.StopDesc.Value,
                        liveData = liveData
                    });
                    
                    _logger.LogInformation("Successfully fetched live data for stop {StopId}", stop.StopId.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching live data for stop {StopId} from {Url}", 
                        stop.StopId.Value, $"{DEPARTURES_URL}?stopId={stop.StopId.Value}");
                    
                    result.Add(new
                    {
                        id = stop.Id,
                        stopId = stop.StopId.Value,
                        stopDesc = stop.StopDesc.Value,
                        liveData = (object?)null,
                        error = "Failed to fetch live data"
                    });
                }
            }

            return result;
        }
    }
}
