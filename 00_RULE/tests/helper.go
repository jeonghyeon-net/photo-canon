package rules

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func rootDir(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot locate helper")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(file), "..", ".."))
}

func absPath(t *testing.T, rel string) string {
	t.Helper()
	return filepath.Join(rootDir(t), filepath.FromSlash(rel))
}

func readText(t *testing.T, rel string) string {
	t.Helper()
	content, err := os.ReadFile(absPath(t, rel))
	if err != nil {
		t.Fatalf("read %s: %v", rel, err)
	}
	return string(content)
}

func readJSON(t *testing.T, rel string) map[string]any {
	t.Helper()
	var value map[string]any
	if err := json.Unmarshal([]byte(readText(t, rel)), &value); err != nil {
		t.Fatalf("parse %s: %v", rel, err)
	}
	return value
}

func exists(t *testing.T, rel string) bool {
	t.Helper()
	_, err := os.Stat(absPath(t, rel))
	return err == nil
}

func walkFiles(t *testing.T, skip map[string]bool) []string {
	t.Helper()
	root := rootDir(t)
	var files []string
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() && skip[entry.Name()] {
			return filepath.SkipDir
		}
		if !entry.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walk repo: %v", err)
	}
	return files
}

func relPath(t *testing.T, path string) string {
	t.Helper()
	rel, err := filepath.Rel(rootDir(t), path)
	if err != nil {
		t.Fatalf("rel %s: %v", path, err)
	}
	return filepath.ToSlash(rel)
}

func containsAll(t *testing.T, rel string, texts ...string) {
	t.Helper()
	content := readText(t, rel)
	for _, text := range texts {
		if !strings.Contains(content, text) {
			t.Fatalf("%s missing %q", rel, text)
		}
	}
}
