export default function () {
  // TODO: update skeleton to match new profile layout
  return (
    <div className="bg-purple-gradient -mt-16 flex h-screen w-screen justify-center bg-cover bg-center">
      <div className="flex w-full flex-row items-center justify-center">
        <div className="skeleton h-[470px] w-[768px] self-center rounded-2xl p-2 text-center md:p-12">
          <div className="skeleton mx-auto -mt-16 block h-48 w-48 rounded-full bg-cover bg-center shadow-xl lg:hidden" />
        </div>
        <div className="skeleton h-[550px] w-[366px] rounded-2xl max-lg:hidden"></div>
      </div>
    </div>
  );
}
