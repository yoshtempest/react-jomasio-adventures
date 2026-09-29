import { createSlicedProjectile } from "./createSlicedProjectile";
import { shouldCutProjectile } from "./shouldCutProjectile";
import { updateSlicedProjectile } from "./updateSlicedProjectile";

export { createSlicedProjectile, shouldCutProjectile, updateSlicedProjectile };

// A constante vive em `./constants` para o helper não fechar ciclo em runtime
// com este barrel. Re-exportada aqui para manter a API pública do módulo.
export { MARSHADOW_CHARACTER_ID } from "./constants";
