import {EditElementPopup} from "@/app/dashboard/edit/[project]/EditorHelper";
import {InputTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {AsteriskIcon, BooleanIcon, HashtagIcon, QuestionMarkIcon, StringIcon} from "../../FlareUI/FlareIcons";

function TypeTag({type}) {
  switch (type.toString().toLowerCase()) {
    case "boolean":
      return (
        <div className="px-4 py-0.5 rounded-lg flex items-center justify-center gap-2 font-semibold font-mono text-black/70 bg-gray-300">
          <BooleanIcon className="text-lg"/>
          Boolean
        </div>
      )
    case "string":
      return (
        <div className="px-4 py-0.5 rounded-lg flex items-center justify-center gap-2 font-semibold font-mono text-black/70 bg-gray-300">
          <StringIcon className="text-lg"/>
          String
        </div>
      )
    case "number":
      return (
        <div className="px-4 py-0.5 rounded-lg flex items-center justify-center gap-2 font-semibold font-mono text-black/70 bg-gray-300">
          <HashtagIcon className="text-lg"/>
          Number
        </div>
      )
    case "required":
      return (
        <div className="px-4 py-0.5 rounded-lg flex items-center justify-center gap-2 font-semibold font-mono text-black/70 bg-rose-400">
          <AsteriskIcon className="text-lg"/>
          Required
        </div>
      )
    case "optional":
      return (
        <div className="px-4 py-0.5 rounded-lg flex items-center justify-center gap-2 font-semibold font-mono text-black/70 bg-blue-400">
          <QuestionMarkIcon className="text-lg"/>
          Optional
        </div>
      )
  }
}

function MethodTag({method}) {
  switch (method.toString().toUpperCase()) {
    case "GET":
      return (
        <div className="px-4 py-0.5 select-none rounded-lg font-semibold font-mono text-black/70 bg-green-300">
          GET
        </div>
      )
  }
}

export function ApiEndpoint({id, title, endpoint}) {

  return (
    <div className="rounded-xl border p-4 px-10 gap-2 border-stone-400 overflow-hidden flex flex-col">
      <p className="font-bold text-lg">{title}</p>
      <p className="font-normal">{endpoint.description}</p>
      <p className="font-semibold">Endpoint</p>
      <div className="flex gap-4 bg-orange-fade rounded-lg p-2 items-center">
        <MethodTag method={endpoint.method}/>
        <p className="font-bold">{endpoint.endpoint}</p>
      </div>
      { endpoint.headers &&
        <div>
          <p className="font-semibold">Headers</p>
          <div className="inline-block">
            <table className="border-collapse text-sm">
              <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Header</th>
                <th className="px-4 py-2 text-left">Value</th>
              </tr>
              </thead>
              <tbody>
              {Object.entries(endpoint.headers).map(([id, data]) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{id}</td>
                  <td className="px-4 py-2">{data}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      { endpoint.query_params &&
      <div>
        <p className="font-semibold">Query Params</p>
        <div className="inline-block">
          <table className="border-collapse text-sm">
            <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Details</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(endpoint.query_params).map(([id, data]) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{id}</td>
                <td className="px-4 py-2 flex gap-1 flex-wrap">
                  <TypeTag type={data.type} />
                  {!data.required &&
                    <TypeTag type={(data.required === false ? "optional" : "required")}/>
                  }
                </td>
                <td className="px-4 py-2">{data.description}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      }
      { endpoint.path_params &&
        <div>
          <p className="font-semibold">Path Params</p>
          <div className="inline-block">
            <table className="border-collapse text-sm">
              <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Parameter</th>
                <th className="px-4 py-2 text-left">Details</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
              </thead>
              <tbody>
              {Object.entries(endpoint.path_params).map(([id, data]) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{id}</td>
                  <td className="px-4 py-2 flex">
                    <TypeTag type={data.type} />
                  </td>
                  <td className="px-4 py-2">{data.description}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      {endpoint.response &&
        Object.entries(endpoint.response).map(([status, data]) => (
          <div key={status}>
            {status} {data}
          </div>
        ))
      }
    </div>
  );
}

export function InEditor({id, title = "", text = "insert your code", language = "javascript", lineNumber = true}) {
  return (
    <div>

    </div>
  )
}

function CodeEditModal({functions, closeFunction, id, size, title}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit Code Box</p>
      <InputTypeBox onChange={(e) => functions.updateElement(id, {title: e.target.value})}
                    title="Add a title (Empty fo no title)" placeholder="Some title" defaultValue={title}
      />
    </EditElementPopup>
  )
}

const paragraphModule = {
  element: ApiEndpoint,
  in_editor: InEditor,
  element_name: ["api"]
}

export default paragraphModule