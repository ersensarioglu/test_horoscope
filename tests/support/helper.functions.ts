import * as fs from 'fs';
import * as path from 'path';

export function getConfigValue(param: string): string | undefined {
    const configDir = path.resolve(__dirname, '../config');
    const files = fs.readdirSync(configDir).filter(f => f.endsWith('.properties'));

    for (const file of files) {
        const content = fs.readFileSync(path.join(configDir, file), 'utf-8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const [key, ...rest] = trimmed.split('=');
            if (key.trim() === param) {
                return rest.join('=').trim();
            }
        }
    }
    return undefined;
}
