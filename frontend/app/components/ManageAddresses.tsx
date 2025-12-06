"use client";



export default function ManageAddresses(){

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Addresses Component</h2>
           <div className="flex gap-4 mb-4">
            <select className="border p-2 rounded w-1/4" >
              <option value="">-- Select Customer --</option>
            </select>
            <input type="text" placeholder="Search Customer"   className="border p-2 rounded w-1/3" />
          </div>

          <button
            
            className="bg-blue-600 font-bold text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Add New Customer
          </button>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
               
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
               
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-bold">
              Page   of 
            </span>

            <button
              
              
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
            
          </div>
        </div>
    );
}
