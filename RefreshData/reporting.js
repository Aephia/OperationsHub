/**
 * Validation Reporting Module
 *
 * Generates comprehensive validation reports
 */

const fs = require('fs');
const path = require('path');

class ReportGenerator {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    /**
     * Generate a validation report from task results
     * @param {Array} results - Array of task results
     * @returns {Object} - Report object
     */
    generateReport(results) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                withChanges: results.filter(r => r.changeInfo && r.changeInfo.changed).length,
                withBreakingChanges: results.filter(r => r.changeInfo && r.changeInfo.breaking).length,
                newFiles: results.filter(r => r.changeInfo && r.changeInfo.isNew).length
            },
            details: results.map(r => ({
                file: r.file,
                success: r.success,
                outputFiles: r.outputFiles || [],
                changed: r.changeInfo ? r.changeInfo.changed : false,
                breaking: r.changeInfo ? r.changeInfo.breaking : false,
                isNew: r.changeInfo ? r.changeInfo.isNew : false,
                validationWarning: r.validationWarning || null,
                error: r.error || null,
                diff: r.changeInfo ? r.changeInfo.diff : null
            })),
            alerts: []
        };

        // Generate alerts
        results.forEach(result => {
            if (result.changeInfo && result.changeInfo.breaking) {
                report.alerts.push({
                    level: 'ERROR',
                    file: result.file,
                    message: `Breaking schema changes detected in ${result.file}`,
                    changes: result.changeInfo.diff.breaking
                });
            }

            if (!result.success) {
                report.alerts.push({
                    level: 'ERROR',
                    file: result.file,
                    message: result.error || 'Processing failed'
                });
            }

            if (result.validationWarning) {
                report.alerts.push({
                    level: 'WARNING',
                    file: result.file,
                    message: result.validationWarning
                });
            }

            if (result.changeInfo && result.changeInfo.isNew) {
                report.alerts.push({
                    level: 'INFO',
                    file: result.file,
                    message: `New file detected: ${result.file}`
                });
            }
        });

        return report;
    }

    /**
     * Write report to JSON file
     * @param {Object} report - Report object
     * @returns {string} - Path to report file
     */
    writeReport(report) {
        const reportPath = path.join(this.outputDir, 'REFRESH-REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        return reportPath;
    }

    /**
     * Print console summary of report
     * @param {Object} report - Report object
     */
    printSummary(report) {
        console.log('\n=== Validation Report ===');
        console.log(`Total tasks: ${report.summary.total}`);
        console.log(`✅ Successful: ${report.summary.successful}`);
        console.log(`❌ Failed: ${report.summary.failed}`);
        console.log(`📝 With changes: ${report.summary.withChanges}`);
        console.log(`⚠️  Breaking changes: ${report.summary.withBreakingChanges}`);
        console.log(`✨ New files: ${report.summary.newFiles}`);

        if (report.alerts.length > 0) {
            console.log(`\n⚠️  ${report.alerts.length} Alert(s):`);
            report.alerts.forEach(alert => {
                const icon = alert.level === 'ERROR' ? '❌' : alert.level === 'WARNING' ? '⚠️' : 'ℹ️';
                console.log(`   ${icon} [${alert.level}] ${alert.file}: ${alert.message}`);
                if (alert.changes && alert.changes.length > 0) {
                    alert.changes.forEach(change => {
                        console.log(`      - ${change}`);
                    });
                }
            });
        }

        // Show change details
        const changedFiles = report.details.filter(d => d.changed && !d.isNew);
        if (changedFiles.length > 0) {
            console.log(`\n📋 Changed Files:`);
            changedFiles.forEach(file => {
                console.log(`   ${file.file}:`);
                if (file.diff) {
                    if (file.diff.breaking.length > 0) {
                        console.log(`      ❌ Breaking changes: ${file.diff.breaking.length}`);
                    }
                    if (file.diff.additions.length > 0) {
                        console.log(`      ✨ Additions: ${file.diff.additions.length}`);
                    }
                    if (file.diff.modifications.length > 0) {
                        console.log(`      📝 Modifications: ${file.diff.modifications.length}`);
                    }
                }
            });
        }
    }

    /**
     * Generate and save report, then print summary
     * @param {Array} results - Task results
     * @returns {Object} - Generated report
     */
    generateAndReport(results) {
        const report = this.generateReport(results);
        const reportPath = this.writeReport(report);
        this.printSummary(report);
        console.log(`\n📄 Full report saved to: ${reportPath}`);
        return report;
    }
}

module.exports = ReportGenerator;
