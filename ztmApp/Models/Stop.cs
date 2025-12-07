using ztmApp.Models.ValueObjects;

namespace ztmApp.Models
{
    public class Stop
    {
        public int Id { get; set; }
        public StopId StopId { get; private set; } = null!;
        public StopDesc StopDesc { get; private set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public Stop(int stopId, string stopDesc)
        {
            StopId = new StopId(stopId);
            StopDesc = new StopDesc(stopDesc);
        }

        private Stop() { }
    }
}
