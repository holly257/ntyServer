const app = require('../app');
const { expect } = require('chai');
const supertest = require('supertest');

describe('GET /books', () => {
    it('should respond to get request and return array of books',() => {
        return supertest(app)
            .get('/books')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const book = res.body[0];
                expect(book).to.include.all.keys('bestsellers_date', 'author', 
                'description', 'title', 'rank');
            })
        });
    it('should return a 400 if the sort is not title or rank', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'wrong'})
            .expect(400, 'Sort must be one of title or rank')
    });
    it('should sort by title', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'title'})
            .expect(200)
            .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf.at.least(1)
                    let i = 0
                    let sorted = true
                    while(sorted && i < res.body.length - 1) {
                        sorted = sorted && res.body[i].title < res.body[i + 1].title
                        i++
                    }
                    expect(sorted).to.be.true
                })

    })
    it('should sort by rank', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'rank'})
            .expect(200)
            .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf.at.least(1)
                    let sorted = true;
                    let i = 0;
                    while (i < res.body.length - 1) {
                        const bookAtI = res.body[i];
                        const bookAtIPlus1 = res.body[i + 1];
                        if (bookAtIPlus1.rank < bookAtI.rank) {
                            sorted = false;
                            break; 
                        }
                        i++;
                    }
                    expect(sorted).to.be.true;
                })

    })
    it('should filter by titie', () => {
        return supertest(app)
            .get('/books')
            .query({search: 'odd'})
            .expect(200)
            .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf.at.least(1)
                    expect(res.body).to.deep.equal([
                        {
                            bestsellers_date: 1211587200000,
                            published_date: 1212883200000,
                            author: "Dean R Koontz",
                            description:
                              "Odd Thomas, who can communicate with the dead, confronts evil forces in a California coastal town.",
                            price: 27,
                            publisher: "Bantam",
                            title: "ODD HOURS",
                            rank: 1,
                            rank_last_week: 0,
                            weeks_on_list: 1,
                            id: "5b4aa4ead3089013507db18b"
                          },
                    ])
                })
    }) 
})