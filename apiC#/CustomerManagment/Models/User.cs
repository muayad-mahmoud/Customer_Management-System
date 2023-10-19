using System.ComponentModel.DataAnnotations;

namespace CustomerManagment.Models
{
    public class User
    {
        public int Id { get; set; }
        public string bname{ get; set; }
        public string company { get; set; }
        public int taxNo { get; set; }
        public string PName { get; set; }
        public int PPhone { get; set; }
        public string Location { get; set; }
        public DateTime StartDate{ get; set; }
        public DateTime EndDate { get; set; }
        public string Logo { get; set; }
        public List<string> Images { get; set; }
    }
}
