import { model } from "mongoose";
import { IVariableDocument } from "./variables.types";
import VariableSchema from "./variables.schema";
export const VariableModel = model<IVariableDocument>("variables", VariableSchema);