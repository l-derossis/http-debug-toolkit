using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Moq;

namespace RequestLogger.Tests.Utils
{
    static class ControllerExtensions
    {
        public static void InjectDefaultHttpContext(this ControllerBase controller)
        {
            var context = new DefaultHttpContext();

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

        }

        public static void MockUrlHelper(this ControllerBase controller)
        {
            var mockUrlHelper = new Mock<IUrlHelper>(MockBehavior.Strict);
            mockUrlHelper
                .Setup(
                    x => x.Action(
                        It.IsAny<UrlActionContext>()
                    )
                )
                .Returns("basePath")
                .Verifiable();

            controller.Url = mockUrlHelper.Object;
        }
    }
}
