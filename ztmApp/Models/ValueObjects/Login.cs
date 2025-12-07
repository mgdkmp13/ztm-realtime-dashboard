namespace ztmApp.Models.ValueObjects
{
    public class Login
    {
        public string Value { get; private set; }

        private Login() { }

        public Login(string login)
        {
            if (string.IsNullOrWhiteSpace(login) || login.Length < 3)
                throw new Exception("Login is too short!");

            Value = login;
        }

        public override string ToString() => Value;
    }
}
