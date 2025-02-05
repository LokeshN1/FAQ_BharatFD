import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import mongoose from "mongoose";

const chai = use(chaiHttp);

describe("FAQ CRUD Operations", () => {
  let token; // Store the token globally for all tests
  let faqId; // To store the ID of a created FAQ for further tests

  before(function (done) {
    if (mongoose.connection.readyState === 1) {
      done();
    } else {
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
  
  
it("should create a new FAQ", function (done) {
    chai.request(app)
      .post("/api/faqs")
      .set("Cookie", `adminToken=${token}`)  // Attach the token as a cookie
      .send({ question: "What is Gas?", answer: "It is a gas" })
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "FAQ created successfully");
        expect(res.body.faq).to.have.property("_id"); // Ensure _id is present
        faqId = res.body.faq._id;  // Store the created FAQ's ID
        done();
      });
  });

  it("should retrieve all FAQs", function (done) {
    chai.request(app)
      .get("/api/faqs")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should update an existing FAQ", function (done) {
    chai.request(app)
      .put(`/api/faqs/${faqId}`)
      .set("Cookie", `adminToken=${token}`)
      .set('Content-Type', 'application/json')
      .send({ 
        question: "Updated question for MERN", 
        answer: "Updated answer for MERN."
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "FAQ updated successfully");
        done();
      });
  });
  

  it("should delete an FAQ", function (done) {
    chai.request(app)
      .delete(`/api/faqs/${faqId}`)
      .set("Cookie", `adminToken=${token}`)  // Attach the token as a cookie
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "FAQ deleted successfully");
        done();
      });
  });
});
