using System;
using System.Net;
using System.Net.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Tests.Entities
{
    [TestClass]
    public class EndpointTests
    {
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        [DataRow("/routes should not have spaces")]
        [DataRow("itShouldStartWithASlash")]
        public void InvalidRoute(string route)
        {
            var _ = new Endpoint
            {
                Body = "valid body",
                StatusCode = HttpStatusCode.OK,
                Method = HttpMethod.Get,
                Route = route
            };
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void InvalidStatusCode()
        {
            var _ = new Endpoint
            {
                Body = "valid body",
                StatusCode = (HttpStatusCode)100000,
                Method = HttpMethod.Get,
                Route = "/route"
            };
        }
    }
}
