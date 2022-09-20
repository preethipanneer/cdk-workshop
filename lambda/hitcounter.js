const { DynamoDB, Lambda } = require('aws-sdk')

exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const dynamoDB = new DynamoDB();
    const lambda = new Lambda();

    await dynamoDB.updateItem({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: event.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': { N: '1' } }
      }).promise();

      const resp = await lambda.invoke({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(event)
      }).promise();
    
      console.log('downstream response:', JSON.stringify(resp, undefined, 2));
    
      // return response back to upstream caller
      return JSON.parse(resp.Payload);


}