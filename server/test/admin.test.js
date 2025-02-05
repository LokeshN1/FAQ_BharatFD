import {use, expect} from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import mongoose from "mongoose";

const chai = use(chaiHttp);

describe("Admin Authentication Tests", () => {
  const faqId = "for_testing_invalidTokenContidion"; 
  before(function (done) {
    // Wait for the database to connect
    if (mongoose.connection.readyState === 1) {
      // Connection is already established
      done();
    } else {
      mongoose.connection.once("open", done); // Wait for connection to open
    }
  });

  it("should not allow access without a valid token", function (done) {
    chai.request(app)
      .put(`/api/faqs/${faqId}`)
      .send({ question: "Test question", answer: "Test answer" })
      .end((err, res) => {
        expect(res).to.have.status(401); // Unauthorized
        expect(res.body).to.have.property("message", "Unauthorized: No token provided");
        done();
      });
  });
  
  it("should login successfully with valid credentials", (done) => {
    chai.request(app)
      .post("/api/admin/login") // Ensure the correct route
      .send({ email: "lokeshnegi399@gmail.com", password: "admin123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Login successful");
        done();
      });
  });

  it("should logout successfully", (done) => {
    chai.request(app)
      .post("/api/admin/logout") // Ensure the correct route
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Logout successful");
        done();
      });
  });


  it("should fail login with if wrong email entered", function (done) {
    chai.request(app)
      .post("/api/admin/login")
      .send({ email: "wrongemail@gmail.com", password: "admin123" })
      .end(function (err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Admin not found");
        done();
      });
  });


  it("should fail login if wrong password entered", function (done) {
    chai.request(app)
      .post("/api/admin/login")
      .send({ email: "lokeshnegi399@gmail.com", password: "wrongpassword" })
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Invalid credentials");
        done();
      });
  });

  
  
});