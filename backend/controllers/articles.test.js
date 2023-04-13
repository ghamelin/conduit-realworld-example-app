const {
  AlreadyTakenError,
  FieldRequiredError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendTagList,
  slugify,
} = require("../helper/helpers");
const { Article, Tag, User } = require("../models");

const includeOptions = [
  { model: Tag, as: "tagList", attributes: ["name"] },
  { model: User, as: "author", attributes: { exclude: ["email"] } },
];

describe("allArticles", () => {
  let req;
  let res;
  let next;
  let loggedUser;

  beforeEach(() => {
    req = {
      loggedUser: {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
      },
      query: {},
    };
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all articles", async () => {
    const article1 = await Article.create({
      title: "Article 1",
      slug: "article-1",
      body: "This is article 1.",
      authorId: 1,
    });
    const article2 = await Article.create({
      title: "Article 2",
      slug: "article-2",
      body: "This is article 2.",
      authorId: 1,
    });

    await allArticles(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      articles: [
        {
          id: article2.id,
          slug: article2.slug,
          title: article2.title,
          description: article2.description,
          body: article2.body,
          createdAt: article2.createdAt.toISOString(),
          updatedAt: article2.updatedAt.toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: "testuser",
            bio: null,
            image: null,
          },
          tagList: [],
        },
        {
          id: article1.id,
          slug: article1.slug,
          title: article1.title,
          description: article1.description,
          body: article1.body,
          createdAt: article1.createdAt.toISOString(),
          updatedAt: article1.updatedAt.toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: "testuser",
            bio: null,
            image: null,
          },
          tagList: [],
        },
      ],
      articlesCount: 2,
    });
  });
});