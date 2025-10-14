/**
 * Schema Validation Module
 *
 * Provides JSON Schema validation using Ajv
 */

const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

class SchemaValidator {
    constructor(schemasDir) {
        this.ajv = new Ajv({ allErrors: true, strict: false });
        this.schemas = {};
        this.schemasDir = schemasDir;
        this.loadSchemas();
    }

    /**
     * Load all JSON schemas from the schemas directory
     */
    loadSchemas() {
        if (!fs.existsSync(this.schemasDir)) {
            console.warn(`⚠️  Schemas directory not found: ${this.schemasDir}`);
            return;
        }

        const schemaFiles = fs.readdirSync(this.schemasDir).filter(f => f.endsWith('.schema.json'));

        schemaFiles.forEach(file => {
            try {
                const schemaPath = path.join(this.schemasDir, file);
                const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
                this.schemas[file] = schema;
                this.ajv.addSchema(schema, file);
            } catch (error) {
                console.error(`❌ Error loading schema ${file}: ${error.message}`);
            }
        });

        console.log(`✅ Loaded ${Object.keys(this.schemas).length} schema(s)`);
    }

    /**
     * Validate data against a schema
     * @param {Object} data - Data to validate
     * @param {string} schemaFile - Schema filename (e.g., 'buildings.schema.json')
     * @returns {Object} - { valid: boolean, errors: array }
     */
    validate(data, schemaFile) {
        if (!schemaFile) {
            return { valid: true, errors: [], warning: 'No schema specified' };
        }

        if (!this.schemas[schemaFile]) {
            return {
                valid: true,
                errors: [],
                warning: `Schema not found: ${schemaFile}`
            };
        }

        const validate = this.ajv.getSchema(schemaFile);
        const valid = validate(data);

        return {
            valid,
            errors: validate.errors || [],
            schema: schemaFile
        };
    }

    /**
     * Format validation errors for display
     * @param {Array} errors - Ajv validation errors
     * @returns {string} - Formatted error message
     */
    formatErrors(errors) {
        if (!errors || errors.length === 0) return '';

        return errors.map(err => {
            const path = err.instancePath || 'root';
            const message = err.message || 'validation error';
            const details = err.params ? JSON.stringify(err.params) : '';
            return `  ${path}: ${message} ${details}`;
        }).join('\n');
    }
}

module.exports = SchemaValidator;
