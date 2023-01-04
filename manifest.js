import fs from "fs";
import path from "path";
import ResEdit from "resedit";

const getFiles = (folder, filter) => {
  return fs.readdirSync(folder).filter(item => filter.test(item)).map(item => path.join(folder, item));
};

const windowsPostBuild = (output) => {
  const exe = ResEdit.NtExecutable.from(fs.readFileSync(output));
  const res = ResEdit.NtExecutableResource.from(exe);
  const iconFile = ResEdit.Data.IconFile.from(fs.readFileSync("app.ico"));

  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033,
    iconFile.icons.map(item => item.data)
  );

  const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];

  vi.setStringValues(
    { lang: 1033, codepage: 1200 },
    {
      ProductName: "NIAS 网络智能分析系统",
      FileDescription: "交换机快速设置工具",
      CompanyName: "CRSCD",
      LegalCopyright: `© ${new Date().getFullYear()} Apollo Wayne.`
    }
  );
  vi.removeStringValue({ lang: 1033, codepage: 1200 }, "OriginalFilename");
  vi.removeStringValue({ lang: 1033, codepage: 1200 }, "InternalName");
  vi.setFileVersion(process.env.npm_package_version);
  vi.setProductVersion(process.env.npm_package_version);
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  fs.writeFileSync(output, Buffer.from(exe.generate()));
};

for (const file of getFiles("./bin", /\.exe$/i)) {
  await windowsPostBuild(file);
}