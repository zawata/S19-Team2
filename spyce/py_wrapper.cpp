#include <boost/python.hpp>

#include "spyce_exceptions.hpp"
#include "spyce.hpp"


//credit: https://stackoverflow.com/questions/2261858/boostpython-export-custom-exception
namespace py = boost::python;
template <class E, class... Policies, class... Args>
py::class_<E, Policies...> exception_(Args&&... args) {
    py::class_<E, Policies...> cls(std::forward<Args>(args)...);
    py::register_exception_translator<E>([ptr=cls.ptr()](E const& e){
        PyErr_SetObject(ptr, py::object(e).ptr());
    });
    return cls;
}

BOOST_PYTHON_MODULE(spyce) {
    using namespace boost::python;

    exception_<FileNotFoundException>("FileNotFoundException")
        .add_property("what", &FileNotFoundException::what);

    class_<spyce>("spyce")
        .add_property("main_file",&spyce::_get_file, &spyce::_set_file)
        .def("add_kernel", &spyce::add_kernel)
        .def("remove_kernel", &spyce::remove_kernel)
        .def("get_objects", &spyce::get_objects);

    class_<Frame>("Frame")
        .def_readwrite("x",  &Frame::x)
        .def_readwrite("y",  &Frame::y)
        .def_readwrite("z",  &Frame::z)
        .def_readwrite("dx", &Frame::dx)
        .def_readwrite("dy", &Frame::dy)
        .def_readwrite("dz", &Frame::dz);
}
