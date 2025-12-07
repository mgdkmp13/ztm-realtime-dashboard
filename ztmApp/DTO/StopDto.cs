using System.ComponentModel.DataAnnotations;

namespace ztmApp.DTO
{
    public class StopDto
    {
        [Required]
        public int StopId { get; set; }

        [Required]
        public string StopDesc { get; set; } = string.Empty;
    }
}
