import login_validation_function from './login_validation_function.cjs';
import  httpMocks from 'node-mocks-http';
import  crypto from 'crypto';




const passwords= [
        {
            username: "User1$%^&",
            password: crypto.createHash('sha256').update("Passw0rd!@#").digest('hex')
        },
        {
            username: "User7~!@#",
            password: crypto.createHash('sha256').update("Passw0rd~!@").digest('hex')
        },
        {
            username: "用户1",
            password: crypto.createHash('sha256').update("密码1").digest('hex')
        },
        {
            username: "用户2",
            password: crypto.createHash('sha256').update("密码2").digest('hex')
        },
        {
            username: "用户3",
            password: crypto.createHash('sha256').update("密码3").digest('hex')
        }
    ];


const userInputs = [
    {
        username: "",     
        password: ""
    },
    {
        username: "User1$%^&",   
        password: "Passw0rd!@#"
    },
    {
        username: "User7~!@#",   
        password: "Passw0rd~!@"
    },
    {
        username: "用户1",   
        password: "密码1"
    },
    {
        username: "用户2",   
        password: "密码2"
    },
    {
        username: "用户3",   
        password: "密码3"
    }
]

describe("Test authenticate function", () => {
    userInputs.forEach((userInput) => {
      test(`It should return 401 for wrong password or user. Or 200 if '${userInput.username}' is authenticated`, () => {
        const req = httpMocks.createRequest({// Den simulere det json vi plejer at sende, eller som serveren kan requeste
          method: 'POST',
          url: '/login',
          body: { username: userInput.username, password: userInput.password }
        });
        const res = httpMocks.createResponse(); // Den mober,  Fordi den simulerer hvordan svarert er
  
        const middleware = login_validation_function(passwords); // den her kan man sige laver functionkallet så hvidt jeg har forstået
        middleware(req, res); // den her kører så simulationen.
        if(res.statusCode===200){
       
        expect(res._getRedirectUrl()).toBe(""); // No redirect
        expect(res.cookies.token).toBeDefined(); // Token cookie should be set
        }
        if (res.statusCode !== 200) {
            expect(res.statusCode).toBe(401);
        }   
      });
    });
  });
