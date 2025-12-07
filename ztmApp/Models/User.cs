using ztmApp.Models.ValueObjects;

namespace ztmApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public Login Login { get; private set; } = null!;
        public HashPassword HashPassword { get; private set; } = null!;

        public List<Stop> Stops { get; set; } = new();

        public User(string login, string password)
        {
            Login = new Login(login);
            HashPassword = HashPassword.Create(password);
        }

        private User() { }
    }
}
