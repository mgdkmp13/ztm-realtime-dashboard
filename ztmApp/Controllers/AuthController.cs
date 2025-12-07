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
    public class AuthController(AppDbContext _db, IJwtService _jwtService) : ControllerBase
    {
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _db.Users.FirstOrDefaultAsync(x => x.Login.Value == dto.Login);
            if (existingUser != null)
                return BadRequest("User with this login already exists");

            var user = new User(dto.Login, dto.Password);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _db.Users.FirstOrDefaultAsync(x => x.Login.Value == dto.Login);
            if (user == null || !user.HashPassword.Verify(dto.Password))
                return Unauthorized(new { message = "Bad credentials" });

            string token = _jwtService.Generate(user.Id);
            
            return Ok(new 
            { 
                token,
                user = new 
                {
                    id = user.Id,
                    login = user.Login.Value
                }
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            int userId = int.Parse(User.Identity!.Name!);
            var user = await _db.Users.FindAsync(userId);
            
            if (user == null)
                return NotFound();

            return Ok(new 
            { 
                id = user.Id, 
                login = user.Login.Value 
            });
        }
    }
}
