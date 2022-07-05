using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Portfolio.Models.Domain.ListingAvailabilityException;
using Portfolio.Models.Requests.ListingAvailabilityExceptions;
using Portfolio.Services;
using Portfolio.Web.Controllers;
using Portfolio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Portfolio.Web.Api.Controllers
{
    [Route("api/Listings/AvailabilityExceptions")]
    [ApiController]
    public class ListingAvailabilityExceptionsApiController : BaseApiController
    {
        private IListingAvailabilityExceptionsService _service = null;
        private IAuthenticationService<int> _authService = null;


        public ListingAvailabilityExceptionsApiController(IListingAvailabilityExceptionsService service
            , ILogger<ListingAvailabilityExceptionsApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<ListingAvailabilityException>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<ListingAvailabilityException> list = _service.Get();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource Not Found.");
                }
                else
                {
                    code = 200;
                    response = new ItemsResponse<ListingAvailabilityException> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }


        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ListingAvailabilityException>> GetByListingId(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ListingAvailabilityException listingAvailabilityExceptions = _service.Get(id);
                if (listingAvailabilityExceptions == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource Not Found.");
                }
                else
                {
                    response = new ItemResponse<ListingAvailabilityException> { Item = listingAvailabilityExceptions };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }


        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ListingAvailabilityExceptionsAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                
                int id = _service.Add(model);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);

            }
            return result;
        }


    }
}
