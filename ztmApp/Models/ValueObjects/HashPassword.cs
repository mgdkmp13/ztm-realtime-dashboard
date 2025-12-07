using BCrypt.Net;

namespace ztmApp.Models.ValueObjects
{
    public class HashPassword
    {
        public string Value { get; private set; }

        private HashPassword() { }

        private HashPassword(string value) => Value = value;

        public static HashPassword Create(string rawPassword)
        {
            if (rawPassword.Length < 6) throw new Exception("Password is too short!");
            string hash = BCrypt.Net.BCrypt.HashPassword(rawPassword);
            return new HashPassword(hash);
        }

        public bool Verify(string password) =>
            BCrypt.Net.BCrypt.Verify(password, Value);
    }
}
