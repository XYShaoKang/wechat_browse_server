"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "WeChat",
    embedded: false
  },
  {
    name: "WeChatUser",
    embedded: false
  },
  {
    name: "ChatRoom",
    embedded: false
  },
  {
    name: "Avatar",
    embedded: false
  },
  {
    name: "Contact",
    embedded: false
  },
  {
    name: "Message",
    embedded: false
  },
  {
    name: "Content",
    embedded: false
  },
  {
    name: "Text",
    embedded: false
  },
  {
    name: "Image",
    embedded: false
  },
  {
    name: "Voice",
    embedded: false
  },
  {
    name: "Video",
    embedded: false
  },
  {
    name: "File",
    embedded: false
  },
  {
    name: "App",
    embedded: false
  },
  {
    name: "FileIndex",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_SERVER_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SERVER_SECRET"]}`
});
exports.prisma = new exports.Prisma();
