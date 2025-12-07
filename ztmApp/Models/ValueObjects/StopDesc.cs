namespace ztmApp.Models.ValueObjects
{
    public class StopDesc
    {
        public string Value { get; private set; }

        private StopDesc() { }

        public StopDesc(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Stop description cannot be empty");

            if (value.Length > 200)
                throw new ArgumentException("Stop description is too long");

            Value = value;
        }

        public override string ToString() => Value;
    }
}
