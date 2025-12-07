namespace ztmApp.Services
{
    public interface IJwtService
    {
        string Generate(int userId);
    }
}
