#include <boost/python.hpp>

#include "spyce_exceptions.hpp"
#include "spyce.hpp"

namespace py = boost::python;
template <class E> void exception_(const char *name) {
    //check that class type E inherits from SpyceException(to Ensure it has a `what` call)
    static_assert(std::is_base_of<SpyceException, E>::value, "Exception must inherit from Spyce Exception");

    //build Full Qualified Object Name underneath the current Module
    std::string full_name = std::string(py::extract<std::string>(py::scope().attr("__name__"))) + "." + name;

    //Declare a new Python Error that inherits from the `Exception Class` in python
    PyObject *exc = PyErr_NewException(full_name.c_str(), PyExc_Exception, 0);

    //give control of python exception class to Boost Python
    py::scope().attr(name) = py::handle<>(exc);

    //register the exception translator for the new exception class <template E>
    py::register_exception_translator<E>(
        //c++ lambda
        [exc=exc](E const&e){
            //throw a Python Exception with that same `what` data as the C++ Exception
            PyErr_SetString(exc, e.what().c_str());
        });
}
#define exception(NAME) exception_<NAME ## Exception>(#NAME"Error")

BOOST_PYTHON_MODULE(spyce) {
    using namespace boost::python;

    exception(FileNotFound);
    exception(InvalidFile);
    exception(InvalidArgument);
    exception(Internal);
    exception(IDNotFound);
    exception(InsufficientData);

    def("str_to_id", &spyce::str_to_id);
    def("id_to_str", &spyce::id_to_str);

    class_<spyce>("spyce")
        .add_property("main_file",&spyce::_get_file, &spyce::_set_file)
        .def("add_kernel", &spyce::add_kernel)
        .def("remove_kernel", &spyce::remove_kernel)
        .def("utc_to_et", &spyce::utc_to_et)
        .def("et_to_utc", &spyce::et_to_utc)
        .def("get_objects", &spyce::get_objects)
        .def("get_frame_data", &spyce::get_frame_data);

    class_<Frame>("Frame")
        .def_readwrite("x",  &Frame::x)
        .def_readwrite("y",  &Frame::y)
        .def_readwrite("z",  &Frame::z)
        .def_readwrite("dx", &Frame::dx)
        .def_readwrite("dy", &Frame::dy)
        .def_readwrite("dz", &Frame::dz);
}
