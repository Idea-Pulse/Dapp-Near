import { NetworkOptions } from "./NetworkOptions";
import { useDisconnect } from "wagmi";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();

  return (
    <div className="dropdown dropdown-end mr-2">
      <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
        <span className="material-icons text-sm align-text-bottom mr-1">error</span>
        <span>Wrong network</span>
        <span className="material-icons text-sm align-text-bottom ml-1">arrow_drop_down</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
      >
        <NetworkOptions />
        <li>
          <button
            className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={() => disconnect()}
          >
            <span className="material-icons text-sm align-text-bottom">logout</span>
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
