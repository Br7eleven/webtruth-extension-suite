/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "jjh1yhdx53gyz4h",
    "created": "2025-07-20 16:23:08.417Z",
    "updated": "2025-07-20 16:23:08.417Z",
    "name": "claims",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ldmo8ss8",
        "name": "claimText",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "neky367v",
        "name": "verdict",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hzyhferg",
        "name": "explanation",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("jjh1yhdx53gyz4h");

  return dao.deleteCollection(collection);
})
