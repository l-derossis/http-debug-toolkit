namespace RequestLogger.Domain.Errors
{
    public class DomainError
    {
        public readonly string Message;

        public DomainError(string message)
        {
            Message = message;
        }
    }
}
