using Portfolio.Data;
using Portfolio.Data.Providers;
using Portfolio.Models.Domain.ListingAvailabilityException;
using Portfolio.Models.Requests.ListingAvailabilityExceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Services
{
    public class ListingAvailabilityExceptionsService : IListingAvailabilityExceptionsService
    {
        IDataProvider _data = null;

        public ListingAvailabilityExceptionsService(IDataProvider data)
        {
            _data = data;
        }


        public List<ListingAvailabilityException> Get()
        {
            List<ListingAvailabilityException> list = null;
            string procName = "[dbo].[ListingAvailabilityExceptions_GetAllListingId]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                ListingAvailabilityException listingavailabilityexceptions = MapListingAvailabilityExceptions(reader, ref startingIdex);
                if (list == null)
                {
                    list = new List<ListingAvailabilityException>();
                }
                list.Add(listingavailabilityexceptions);
            });

            return list;
        }


        public ListingAvailabilityException Get(int ListingId)
        {
            int startingIdex = 0;
            string procName = "[dbo].[ListingAvailabilityExceptions_SelectByListingId]";

            ListingAvailabilityException listingAvailabilityExceptions = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                
                paramCollection.AddWithValue("@ListingId", ListingId);

            }, delegate (IDataReader reader, short set)
            {

                listingAvailabilityExceptions = MapListingAvailabilityExceptions(reader, ref startingIdex);

            }
            );
            return listingAvailabilityExceptions;
        }


        public int Add(ListingAvailabilityExceptionsAddRequest model)
        {
            int id = 0;

            string procName = "[dbo].[ListingAvailabilityExceptions_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ListingId", model.ListingId);
                col.AddWithValue("@DateStart", model.DateStart);
                col.AddWithValue("@DateEnd", model.DateEnd);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oldId = returnCollection["@Id"].Value;

                int.TryParse(oldId.ToString(), out id);
            }
            );
            return id;
        }


        private static ListingAvailabilityException MapListingAvailabilityExceptions(IDataReader reader, ref int startingIdex)
        {
            ListingAvailabilityException listingAvailabilityExceptions = new ListingAvailabilityException();


            listingAvailabilityExceptions.Id = reader.GetSafeInt32(startingIdex++);
            listingAvailabilityExceptions.ListingId = reader.GetSafeInt32(startingIdex++);
            listingAvailabilityExceptions.DateStart = reader.GetSafeDateTime(startingIdex++);
            listingAvailabilityExceptions.DateEnd = reader.GetSafeDateTime(startingIdex++);

            return listingAvailabilityExceptions;

        }
    }
}



