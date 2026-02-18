export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const devMessage = `Firestore Permission Denied: The following request was denied by Firestore Security Rules: ${JSON.stringify(context, null, 2)}`;
    const prodMessage = 'You do not have permission to perform this action.';
    super(process.env.NODE_ENV === 'development' ? devMessage : prodMessage);
    this.name = 'FirestorePermissionError';
    this.context = context;
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }

  toContextObject() {
    return this.context;
  }
}
