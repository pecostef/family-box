import {
  PreTokenGenerationTriggerEvent,
  PreTokenGenerationTriggerHandler,
} from 'aws-lambda';

// use a pre token generation lambda which adds additional context the ID token
// which can be used on the frontend to show/hide ui components
export const handler: PreTokenGenerationTriggerHandler = async (
  event: PreTokenGenerationTriggerEvent
): Promise<unknown> => {
  try {
    let userId = null;

    try {
      const identities = JSON.parse(event.request.userAttributes?.identities);
      if (identities && identities.length > 0) {
        userId = identities[0].userId;
      }
    } catch (error) {
      console.error(
        'could not parse identities ',
        event.request.userAttributes?.identities
      );
    }

    if (userId) {
      const response = {
        ...event,
        response: {
          claimsOverrideDetails: {
            claimsToAddOrOverride: {
              userId: userId,
            },
            claimsToSuppress: [],
          },
        },
      };
      return response;
    }

    return event;
  } catch (error) {
    console.error('something went wrong during pre token generation', error);
  }
};
