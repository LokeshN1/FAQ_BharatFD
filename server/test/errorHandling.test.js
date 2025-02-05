import { use, expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import app from "../src/app.js";

const chai = use(chaiHttp);

describe("Error Handling Tests", function () {
  let token;
  // Ensure database is connected before tests
  before(function (done) {
    if (mongoose.connection.readyState === 1) {
      // Database is already connected
      done();
    } else {
      // Wait for the database connection
      mongoose.connection.once("open", done);
    }
  });

  before(function (done) {
    chai.request(app)
    .post("/api/admin/login")
    .send({ email: "lokeshnegi399@gmail.com", password: "admin123" })
    .end((err, res) => {
      if (err) return done(err);

      // Extract the token from the response cookies
      const cookies = res.headers['set-cookie'];
      const tokenCookie = cookies.find(cookie => cookie.startsWith("adminToken="));
      
      // Extract the token value from the cookie (before the semicolon)
      if (tokenCookie) {
        token = tokenCookie.split("=")[1].split(";")[0]; // Extract the token value
      }

      // Ensure token is properly extracted
      expect(token).to.exist;

      console.log("Token: ", token); // Log the token here

      done();
    });
  });

  it("should return 404 for non-existent route", function (done) {
    chai
      .request(app)
      .get("/api/non-existent-route")
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Not Found - /api/non-existent-route");
        done();
      });
  });

  
  it("should return 400 for bad requests", function (done) {
    chai.request(app)
      .post("/api/faqs")
      .set("Cookie", `adminToken=${token}`) // Attach the token as a cookie
      .send({ answer: "Missing question field" }) // Missing the 'question' field
      .end((err, res) => {
        console.log("Response Body for Bad Request Test:", res.body); // Debugging
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Question and answer are required");
        done();
      });
  });
  
});
