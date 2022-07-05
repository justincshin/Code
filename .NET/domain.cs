using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Models.Domain.ListingAvailabilityException
{
    public class ListingAvailabilityException
    {
        public int Id { get; set; }
        public int ListingId { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
    }
}
