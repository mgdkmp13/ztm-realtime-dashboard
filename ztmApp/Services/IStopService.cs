using ztmApp.Models;

namespace ztmApp.Services
{
    public interface IStopService
    {
        Task<List<object>> AttachLiveData(List<Stop> stops);
        Task<List<object>> GetAllStopsFromZtm();
    }
}
