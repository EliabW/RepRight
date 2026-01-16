// creates an action filter that ensures the current user owns the resource they are trying to access
// makes the controllers cleaner by abstracting ownership logic

using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Filters;

public class RequireOwnershipAttribute : ActionFilterAttribute
{
    private readonly string _routeParameter;

    public RequireOwnershipAttribute(string routeParameter = "id")
    {
        _routeParameter = routeParameter;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var currentUserId = context.HttpContext.User.GetUserId();

        if (currentUserId == null)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Invalid token" });
            return;
        }

        // get the resource ID from route
        if (!context.RouteData.Values.TryGetValue(_routeParameter, out var resourceIdObj))
        {
            context.Result = new BadRequestObjectResult(new { message = "Resource ID not found" });
            return;
        }

        if (!int.TryParse(resourceIdObj?.ToString(), out int resourceId))
        {
            context.Result = new BadRequestObjectResult(new { message = "Invalid resource ID" });
            return;
        }

        // check ownership
        if (currentUserId != resourceId)
        {
            context.Result = new ObjectResult(
                new { message = "You can only access your own resources" }
            )
            {
                StatusCode = 403,
            };
            return;
        }

        base.OnActionExecuting(context);
    }
}
