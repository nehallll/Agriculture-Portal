using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AdminPortal.Data;
using AdminPortal.Dto;
using AdminPortal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AdminPortal.Controllers
{
    [Route("admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly ApplicationContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(ApplicationContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Hash passwords
        private (string hashedPassword, string salt) HashPassword(string password)
        {
            byte[] saltbytes = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltbytes);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltbytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return (hashed, Convert.ToBase64String(saltbytes));
        }


        private bool VerifyPassword(string storedHashedPassword, string storedSalt, string providedPassword)
        {
            byte[] salt = Convert.FromBase64String(storedSalt);

            string hashedProvidedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: providedPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));


            return storedHashedPassword == hashedProvidedPassword;
        }
        private string GenerateJwtToken(Admin admin)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, admin.Email),
            new Claim("user_id", admin.Id.ToString()),
            new Claim("authorities", admin.Role)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(8000),
                signingCredentials: credentials
            //issuer: jwtSettings["Issuer"], 
            //audience: jwtSettings["Audience"] 
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 1. Register Admin
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto dto)
        {
            if (ModelState.IsValid)
            {

                var (hashedPassword, salt) = HashPassword(dto.Password);


                var admin = new Admin
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email.ToLower(),
                    Password = hashedPassword,
                    Mobile = dto.Mobile,
                    Role = "ROLE_ADMIN",
                    Salt = salt
                };


                _context.Admin.Add(admin);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Generated Salt: {salt}");
                Console.WriteLine($"Hashed Password: {hashedPassword}");


                return Ok(new { message = "Admin registered successfully." });
            }

            return BadRequest(ModelState);
        }


        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Dto.LoginRequest request)
        {

            //var admin = await _context.Admin.FirstOrDefaultAsync(a => a.Email == request.Email);
            var admin = await _context.Admin
            .Where(a => a.Email.ToLower() == request.Email.ToLower())
            .FirstOrDefaultAsync();

            Console.WriteLine($"Received Email: {request.Email}");
            Console.WriteLine($"Received Password: {request.Password}");


            if (admin == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            bool isPasswordValid = VerifyPassword(admin.Password, admin.Salt, request.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = GenerateJwtToken(admin);
            return Ok(new { Token = token, Message = "Login successful." });
        }

        //get admin details

        [HttpGet("get-admin")]
        [Authorize]
        public async Task<IActionResult> GetAdminDetails()
        {
            var userIdClaim = User.FindFirst("user_id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token.");
            }

            long userId = long.Parse(userIdClaim);
            var admin = await _context.Admin.FindAsync(userId);

            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            var adminDetails = new
            {
                admin.Id,
                admin.FirstName,
                admin.LastName,
                admin.Email,
                admin.Mobile,
                admin.Role
            };

            return Ok(new { Message = "Admin details fetched successfully.", Admin = adminDetails });
        }

    }
}