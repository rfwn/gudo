import { Schema } from "mongoose";
const VariableSchema = new Schema({
    key: String,
    value: String,
});
export default VariableSchema;