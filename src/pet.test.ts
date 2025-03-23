import dotenv from "dotenv";
import request from "supertest";

dotenv.config();
const url = process.env.TEST_TARGET_URL;

const id1 = 334411;
const id2 = 334422;
const nonExistentId = 88887777;

describe("Add a new pet to the store | POST /pet", () => {
    it("should add a pet and return valid data when all fields are defined", async () => {
        const res = await request(url)
            .post("/pet")
            .send({
                id: id1,
                category: { id: 0, name: "string" },
                name: "doggie",
                photoUrls: ["string"],
                tags: [{ id: 0, name: "string" }],
                status: "available",
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it("should add a pet and return valid data when only required fields are defined", async () => {
        const res = await request(url)
            .post("/pet")
            .send({
                id: id2,
                name: "doggie",
                photoUrls: ["string"],
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it("should add a pet and return valid data when all fields are minimally defined", async () => {
        const res = await request(url)
            .post("/pet")
            .send({
                id: id1,
                category: { id: 0, name: "" },
                name: "",
                photoUrls: [],
                tags: [],
                status: "",
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it("should return 405 for invalid input", async () => {
        const res = await request(url)
            .post("/pet")
            .send({
                id: id2 + 1,
            });

        expect(res.status).toBe(405);
    });

    it("should return 405 for invalid data types", async () => {
        const res = await request(url).post("/pet").send({
            id: "string",
            category: "string",
            name: 1,
            photoUrls: "string",
            tags: 1,
            status: "invalidEnum",
        });

        expect(res.status).toBe(405);
    });
});

describe("Deletes a pet | DELETE /pet/{petId}", () => {
    it("should delete pet", async () => {
        const res = await request(url).delete(`/pet/${id2}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it("should return 404 for pet not found", async () => {
        const res = await request(url).delete(`/pet/${nonExistentId}`);

        expect(res.status).toBe(404);
    });

    it("should return 400 for invalid pet id (-1)", async () => {
        const res = await request(url).delete(`/pet/${-1}`);

        expect(res.status).toBe(400);
    });

    it("should return 400 for invalid pet id (string)", async () => {
        const res = await request(url).delete("/pet/abc");

        expect(res.status).toBe(400);
    });
});

describe("Find pet by id | GET /pet/{petId}", () => {
    it("should return pet", async () => {
        const res = await request(url).get(`/pet/${id1}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it("should return 404 for pet not found", async () => {
        const res = await request(url).get(`/pet/${nonExistentId}`);

        expect(res.status).toBe(404);
    });

    it("should return 400 for invalid pet id (-1)", async () => {
        const res = await request(url).get(`/pet/${-1}`);

        expect(res.status).toBe(400);
    });

    it("should return 400 for invalid pet id (string)", async () => {
        const res = await request(url).get("/pet/abc");

        expect(res.status).toBe(400);
    });
});

describe("Find pets by status| GET /pet/findByStatus", () => {
    it("should return pet", async () => {
        const res = await request(url).get("/pet/findByStatus").send({
            status: "pending",
        });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();

        for (let i = 0; i < Math.min(res.body.length, 100); i++) {
            expect(res.body[i].status).toBe("pending");
        }
    });

    it("should return 400 for invalid status (string)", async () => {
        const res = await request(url).get("/pet/findByStatus").send({
            status: "bbcc",
        });

        expect(res.status).toBe(400);
    });

    it("should return 400 for invalid status (number)", async () => {
        const res = await request(url).get("/pet/findByStatus").send({
            status: 1,
        });

        expect(res.status).toBe(400);
    });
});

describe("Update an existing pet | PUT /pet", () => {
    it("should update a pet and return updated data when all fields are defined", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: id2,
                category: { id: 1, name: "string2" },
                name: "doggie2",
                photoUrls: ["string2"],
                tags: [{ id: 1, name: "string2" }],
                status: "pending",
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.id).toBe(id2);
        expect(res.body.category.id).toBe(1);
        expect(res.body.category.name).toBe("string2");
        expect(res.body.name).toBe("doggie2");
        expect(res.body.photoUrls[0]).toBe("string2");
        expect(res.body.tags[0].id).toBe(1);
        expect(res.body.tags[0].name).toBe("string2");
        expect(res.body.status).toBe("pending");
    });

    it("should update a pet and not return data when minimal fields are defined", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: id2,
                name: "doggie3",
                photoUrls: ["string3"],
            });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.name).toBe("doggie3");
        expect(res.body.photoUrls[0]).toBe("string3");
    });

    it("should return 400 for invalid pet id (-1)", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: -1,
                name: "doggie4",
                photoUrls: ["string4"],
            });

        expect(res.status).toBe(400);
    });

    it("should return 400 for invalid pet id (string)", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: "bbcc",
                name: "doggie4",
                photoUrls: ["string4"],
            });

        expect(res.status).toBe(400);
    });

    it("should return 400 for too big of a pet id", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: 2 ** 64 + 1,
                name: "doggie4",
                photoUrls: ["string4"],
            });

        expect(res.status).toBe(400);
    });

    it("should return 404 for pet not found", async () => {
        const res = await request(url)
            .put("/pet")
            .send({
                id: nonExistentId,
                name: "doggie4",
                photoUrls: ["string4"],
            });

        expect(res.status).toBe(404);
    });
});
