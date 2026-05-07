package rules

import (
	"strings"
	"testing"
)

func TestRuleServerWorkerProjectStaysWiredForCloudflareAndRpc(t *testing.T) {
	for _, file := range []string{
		"01_SERVER/package.json", "01_SERVER/wrangler.jsonc", "01_SERVER/src/app/app.ts",
		"01_SERVER/src/modules/system/system-routes.ts", "01_SERVER/src/rpc.ts",
	} {
		if !exists(t, file) {
			t.Fatalf("missing server file: %s", file)
		}
	}
	wrangler := readJSON(t, "01_SERVER/wrangler.jsonc")
	if wrangler["main"] != "src/index.ts" || wrangler["account_id"] != "3b4be5b6010a1641533727c7682c0a82" {
		t.Fatal("server wrangler config mismatch")
	}
	containsAll(t, "01_SERVER/src/app/app.ts", "export type AppType")
	containsAll(t, "01_SERVER/src/rpc.ts", "AppType")
}

func TestRuleAppProjectStaysWiredForPagesCapacitorAndRpc(t *testing.T) {
	for _, file := range []string{
		"02_APP/package.json", "02_APP/wrangler.jsonc", "02_APP/capacitor.config.ts",
		"02_APP/vite.config.ts", "02_APP/src/shared/api/rpc-client.ts",
	} {
		if !exists(t, file) {
			t.Fatalf("missing app file: %s", file)
		}
	}
	wrangler := readJSON(t, "02_APP/wrangler.jsonc")
	if wrangler["name"] != "photo-canon-app" || wrangler["pages_build_output_dir"] != "./dist" {
		t.Fatal("app wrangler config mismatch")
	}
	client := readText(t, "02_APP/src/shared/api/rpc-client.ts")
	if !strings.Contains(client, "photo-canon-server/rpc") || !strings.Contains(client, "hc<AppType>") {
		t.Fatal("app RPC client must use server AppType")
	}
	containsAll(t, "02_APP/src/shared/api/api-base-url.ts", "https://api-photo.jeonghyeon.net")
	if !exists(t, "02_APP/.env.example") {
		t.Fatal("app must commit Firebase env placeholders only")
	}
}
