namespace ztmApp.Models.ValueObjects
{
    public class StopId
    {
        public int Value { get; private set; }

        private StopId() { }

        public StopId(int value)
        {
            if (value <= 0)
                throw new ArgumentException("StopId must be greater than 0");

            Value = value;
        }

        public override string ToString() => Value.ToString();
    }
}
