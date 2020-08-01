export default (User) => ({
  createUser(user) {
    return new User(user).save();
  },
  getFaceEmbeddingDistance(email, faceEmbeddingArr) {
    return User.aggregate([
      {
        $addFields: {
          distance: {
            $let: {
              vars: {
                pow: {
                  $reduce: {
                    input: {
                      $zip: {
                        inputs: [
                          faceEmbeddingArr,
                          '$faceEncoding'
                        ]
                      }
                    },
                    initialValue: 0,
                    in: {
                      $add: [
                        '$$value',
                        {
                          $pow: [
                            {
                              $subtract: [
                                {
                                  $arrayElemAt: [
                                    '$$this',
                                    0
                                  ]
                                },
                                {
                                  $arrayElemAt: [
                                    '$$this',
                                    1
                                  ]
                                }
                              ]
                            },
                            2
                          ]
                        }
                      ]
                    }
                  }
                }
              },
              in: {
                $sqrt: '$$pow'
              }
            }
          }
        }
      },
      {
        $sort: {
          distance: 1
        }
      }
    ]).exec();
  },
  findUserByEmail(email) {
    return User.findOne({ email });
  },
});
