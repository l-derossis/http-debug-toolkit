﻿using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Controllers;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using RequestLogger.Infrastructure.Data;
using System.Threading.Tasks;

namespace RequestLogger.Tests.Controllers
{
    [TestClass]
    public class ResponseControllerTests
    {
        private ResponseController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            var repository = new InMemoryMockedResponseRepository();
            var service = new MockedResponseService(repository);
            _controller = new ResponseController(service);
        }

        [TestMethod]
        public async Task RegisterResponse_Success()
        {
            var dto = new ResponseDto
            {
                Body = "body",
                Method = "GET",
                Route = "/route",
                StatusCode = 201
            };

            var result = await _controller.RegisterResponse(dto);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [DataRow("",200,"","")] // Method should not be empty
        [DataRow("/",200,"","ME THOD")] // Method should not contain spaces
        [DataRow("",5151,"","GET")] // Status code does not exist
        [DataRow("/ invalid route", 200, "", "GET")] // Routes should not have spaces
        public async Task RegisterResponse_BadRequest(string route, int statusCode, string body, string method)
        {
            var dto = new ResponseDto
            {
                Body = body,
                Method = method,
                Route = route,
                StatusCode = statusCode
            };

            var result = await _controller.RegisterResponse(dto);
            result.Should().BeOfType<BadRequestObjectResult>();
        }
    }
}
