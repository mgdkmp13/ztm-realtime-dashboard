using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ztmApp.Data;
using ztmApp.DTO;
using ztmApp.Models;
using ztmApp.Services;

namespace ztmApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class StopController(AppDbContext _db, IStopService _stopService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetMy()
        {
            int userId = int.Parse(User.Identity!.Name!);
            var stops = await _db.Stops.Where(s => s.UserId == userId).ToListAsync();

            var result = await _stopService.AttachLiveData(stops);
            return Ok(result);
        }

        [HttpGet("all-ztm-stops")]
        public async Task<IActionResult> GetAllZtmStops()
        {
            var stops = await _stopService.GetAllStopsFromZtm();
            return Ok(stops);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] StopDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = int.Parse(User.Identity!.Name!);
            
            var existingStop = await _db.Stops
                .FirstOrDefaultAsync(s => s.UserId == userId && s.StopId.Value == dto.StopId);
            
            if (existingStop != null)
                return BadRequest(new { message = "Ju¿ masz ten przystanek na swojej liœcie!" });
            
            var stop = new Stop(dto.StopId, dto.StopDesc)
            {
                UserId = userId
            };

            _db.Add(stop);
            await _db.SaveChangesAsync();
            
            return Ok(new 
            { 
                id = stop.Id, 
                stopId = stop.StopId.Value, 
                stopDesc = stop.StopDesc.Value 
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = int.Parse(User.Identity!.Name!);
            var stop = await _db.Stops.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (stop == null) return NotFound();

            _db.Remove(stop);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
