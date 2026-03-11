To run the backend, follow these 2 steps:

Start MySQL: Ensure your MySQL server is running (e.g., via XAMPP, MySQL Installer, or services.msc) and listening on port 3306. The backend is configured to use the root username and root password.
Run Spring Boot: Open a new terminal in the d:\Sprint2.0\billpoint_backend directory and run: .\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
I just tried to run it for you, but it's crashing with a CommunicationsException because the database server is currently offline. Once you start MySQL, that command will bring the API online!

frontend:
npm start