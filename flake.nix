{
  description = "Labcast landing page development shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [ "aarch64-darwin" "aarch64-linux" "x86_64-linux" ];
      forAllSystems = f: builtins.listToAttrs (map (system: {
        name = system;
        value = f (import nixpkgs { inherit system; });
      }) systems);
    in {
      devShells = forAllSystems (pkgs:
        let
          nodeMajor = builtins.replaceStrings [ "\n" ] [ "" ] (builtins.readFile ./.node-version);
          node = pkgs."nodejs_${nodeMajor}";
          pnpm = pkgs.writeShellScriptBin "pnpm" ''
            export PATH="${node}/bin:$PATH"
            exec ${pkgs.corepack}/bin/corepack pnpm "$@"
          '';
        in {
          default = pkgs.mkShell {
            packages = [ node pkgs.corepack pnpm pkgs.git pkgs.gh ];
            shellHook = ''
              labcast_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
              export PATH="$labcast_root/node_modules/.bin:$PATH"
              if [ -f "$labcast_root/pnpm-lock.yaml" ]; then
                pnpm --dir "$labcast_root" install --frozen-lockfile || exit $?
              fi
              unset labcast_root
            '';
          };
        });
    };
}
