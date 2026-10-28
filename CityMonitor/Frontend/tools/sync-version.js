const fs = require("fs");
const path = require("path");

// Also called by webpack, so a standalone npm build uses the same version.
function syncVersion() {
    const root = path.resolve(__dirname, "../..");
    const props = fs.readFileSync(path.join(root, "modversion.props"), "utf8");
    const matches = [...props.matchAll(/<ModVersion>\s*([^<]+?)\s*<\/ModVersion>/g)];
    const version = matches.length === 1 ? matches[0][1].trim() : "";
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version) ||
        version.split(".").some(part => Number(part) > 65534)) {
        throw new Error("modversion.props: ModVersion must be major.minor.patch (each 0–65534).");
    }

    // Prepare every edit before writing any file. Preserve unrelated metadata.
    const edits = [];
    function prepare(relativePath, transform) {
        const file = path.join(root, relativePath);
        const original = fs.readFileSync(file, "utf8");
        const bom = original.startsWith("\uFEFF") ? "\uFEFF" : "";
        const content = original.slice(bom.length);
        const updated = bom + transform(content);
        if (updated !== original) edits.push({ file, updated });
    }
    function prepareJson(relativePath, update) {
        prepare(relativePath, content => {
            const data = JSON.parse(content);
            if (!update(data)) return content;
            const newline = content.includes("\r\n") ? "\r\n" : "\n";
            const trailing = /\r?\n$/.test(content) ? newline : "";
            return JSON.stringify(data, null, 2).replace(/\n/g, newline) + trailing;
        });
    }
    for (const file of ["Frontend/mod.json", "Frontend/package.json"]) {
        prepareJson(file, data => {
            if (data.version === version) return false;
            data.version = version;
            return true;
        });
    }
    if (fs.existsSync(path.join(root, "Frontend/package-lock.json"))) {
        prepareJson("Frontend/package-lock.json", data => {
            const rootPackage = data.packages && data.packages[""];
            const changed = data.version !== version || (rootPackage && rootPackage.version !== version);
            data.version = version;
            if (rootPackage) rootPackage.version = version;
            return changed;
        });
    }
    prepare("Properties/PublishConfiguration.xml", content => {
        const tags = content.match(/<ModVersion\b[^>]*\bValue="[^"]*"[^>]*\/>/g) || [];
        if (tags.length !== 1) throw new Error("PublishConfiguration.xml: expected exactly one ModVersion element.");
        content = content.replace(tags[0], tags[0].replace(/Value="[^"]*"/, `Value="${version}"`));
        // Update only the current changelog heading, never its release notes.
        return content.replace(/(<ChangeLog>\s*Version\s+)\d+\.\d+\.\d+(?:\.\d+)?/, `$1${version}`);
    });
    for (const { file, updated } of edits) fs.writeFileSync(file, updated, "utf8");
    return version;
}

module.exports = syncVersion;
if (require.main === module) {
    console.log(`[CityMonitor] Version synchronized: ${syncVersion()}`);
}

