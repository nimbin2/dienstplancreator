function="$1"
echo "$function"
[[ "$function" = "" ]] && function="dbGet"
sed -n "s/^${function}_\(.*\) = (\(.*\)) *=> .*$/${function}_\1(\2);/p" ./*  | sed "s/ *//g"
