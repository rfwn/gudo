import { Document, Model } from "mongoose";
export interface IVariable {
    key: String,
    value: String,
}
export interface IVariableDocument extends IVariable, Document {}
export interface IVariableModel extends Model<IVariableDocument> {}